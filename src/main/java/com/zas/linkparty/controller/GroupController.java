package com.zas.linkparty.controller;

import com.zas.linkparty.models.Bookmark;
import com.zas.linkparty.models.Group;
import com.zas.linkparty.models.User;
import com.zas.linkparty.repositories.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Optional;

@RestController
public class GroupController {

    GroupRepository groupRepository;

    @Autowired
    public GroupController(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @GetMapping("/api/groups")
    public Iterable<Group> showGroups() {
        return this.groupRepository.findAll();
    }

    @GetMapping("/api/groups/{id}/edit-users")
    public Iterable<User> showUsersWhoCanEdit(@PathVariable Long id) {
        return this.groupRepository.findUsersWhoCanEditById(id);
    }

    @GetMapping("/api/groups/{id}/view-users")
    public Iterable<User> showUsersWhoCanOnlyView(@PathVariable Long id) {
        return this.groupRepository.findUsersWhoCanOnlyViewById(id);
    }

    @GetMapping("/api/groups/{id}/bookmarks")
    public Iterable<Bookmark> showAllBookmarks(@PathVariable Long id) {
        return this.groupRepository.findBookmarks(id);
    }

    @GetMapping("/api/groups/{id}/bookmarks/add")
    public boolean addBookmark(@PathVariable Long id, @RequestBody Bookmark bookmark) {
        return this.groupRepository.saveBookmark(id, bookmark);
    }

    @GetMapping("/api/groups/add/{groupName}")
    public Group addGroup(@PathVariable String groupName, Principal principal) {
        String username = principal.getName();
        Optional<Group> group = groupRepository.save(username, groupName);
        if (group.isEmpty()) {
            return null;
        } else {
            return group.get();
        }
    }

    @GetMapping("/api/groups/{id}/creator")
    public User showCreator(@PathVariable Long id) {
        return this.groupRepository.findWhoCreated(id);
    }

    // -1 an error occurred or wrong url
    // 0 nothing happened
    // 1 can edit now
    // 2 joined!
    @GetMapping("/api/groups/join/{url}")
    public int join(Principal principal, @PathVariable String url) {
        if (canEdit(principal, url) || isCreator(principal, url)) {
            return 0;
        } else {
            if (canOnlyView(principal, url)) {
                if (groupRepository.upgradeStatus(principal.getName(), url)) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (groupRepository.join(principal.getName(), url)) {
                    return 2;
                } else {
                    return -1;
                }
            }
        }
    }

    @GetMapping("/api/groups/{url}/canEdit")
    public boolean canEdit(Principal principal, @PathVariable String url) {
        String username = principal.getName();
        return groupRepository.canEdit(username, url);
    }

    @GetMapping("/api/groups/{url}/isCreator")
    public boolean isCreator(Principal principal, @PathVariable String url) {
        String username = principal.getName();
        return groupRepository.isCreator(username, url);
    }

    @GetMapping("/api/groups/{url}/canOnlyView")
    public boolean canOnlyView(Principal principal, @PathVariable String url) {
        String username = principal.getName();
        return groupRepository.canView(username, url);
    }
}